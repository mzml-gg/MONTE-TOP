import { encodePathSegments } from '@/helpers';
import { differenceInHours, format, formatDistanceToNow } from 'date-fns';
import React, { memo } from 'react';
import { FileObject } from '@/api/server/files/loadDirectory';
import FileDropdownMenu from '@/components/server/files/FileDropdownMenu';
import { ServerContext } from '@/state/server';
import { NavLink, useRouteMatch } from 'react-router-dom';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import SelectFileCheckbox from '@/components/server/files/SelectFileCheckbox';
import { usePermissions } from '@/plugins/usePermissions';
import { join } from 'pathe';
import { bytesToString } from '@/lib/formatters';
import styles from './style.module.css';
import {
    Folder,
    File,
    FileCode,
    FileText,
    FileArchive,
    Image,
    Database,
    Link as LinkIcon,
    Sliders,
    Terminal
} from 'lucide-react';

const renderFileIcon = (file: FileObject) => {
    if (!file.isFile) {
        return <Folder className={'w-5 h-5 text-[#D4AF37]'} />;
    }

    if (file.isSymlink) {
        return <LinkIcon className={'w-5 h-5 text-[#F2D675]'} />;
    }

    if (file.isArchiveType()) {
        return <FileArchive className={'w-5 h-5 text-[#B88A20]'} />;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    switch (ext) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
        case 'webp':
            return <Image className={'w-5 h-5 text-[#55d88a]'} />;
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
        case 'json':
        case 'html':
        case 'css':
            return <FileCode className={'w-5 h-5 text-[#F2D675]'} />;
        case 'sh':
        case 'py':
        case 'php':
        case 'bash':
            return <Terminal className={'w-5 h-5 text-[#D4AF37]'} />;
        case 'sql':
        case 'db':
        case 'sqlite':
            return <Database className={'w-5 h-5 text-[#ff6b6b]'} />;
        case 'yml':
        case 'yaml':
        case 'env':
        case 'conf':
        case 'ini':
        case 'properties':
        case 'toml':
            return <Sliders className={'w-5 h-5 text-[#F2D675]'} />;
        case 'log':
        case 'txt':
        case 'md':
            return <FileText className={'w-5 h-5 text-[#A89F9F]'} />;
        default:
            return <File className={'w-5 h-5 text-[#A89F9F]'} />;
    }
};

const Clickable: React.FC<{ file: FileObject }> = memo(({ file, children }) => {
    const [canRead] = usePermissions(['file.read']);
    const [canReadContents] = usePermissions(['file.read-content']);
    const directory = ServerContext.useStoreState((state) => state.files.directory);

    const match = useRouteMatch();

    return (file.isFile && (!file.isEditable() || !canReadContents)) || (!file.isFile && !canRead) ? (
        <div className={styles.details}>{children}</div>
    ) : (
        <NavLink
            className={styles.details}
            to={`${match.url}${file.isFile ? '/edit' : ''}#${encodePathSegments(join(directory, file.name))}`}
        >
            {children}
        </NavLink>
    );
}, isEqual);

const FileObjectRow = ({ file }: { file: FileObject }) => (
    <div
        className={
            'group flex items-center px-4 py-3 mb-1.5 rounded-xl bg-[#0D0505]/70 border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 hover:bg-[#210606]/50 transition-all duration-200 shadow-sm'
        }
        key={file.name}
        onContextMenu={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent(`pterodactyl:files:ctx:${file.key}`, { detail: e.clientX }));
        }}
    >
        <SelectFileCheckbox name={file.name} />
        <Clickable file={file}>
            <div css={tw`flex-none ml-4 mr-3`}>
                {renderFileIcon(file)}
            </div>
            <div css={tw`flex-1 truncate font-medium text-sm text-[#FFFFFF] font-mono group-hover:text-[#F2D675] transition-colors`}>
                {file.name}
            </div>
            {file.isFile && (
                <div css={tw`w-1/6 text-right mr-4 hidden sm:block font-mono text-xs text-[#A89F9F]`}>
                    {bytesToString(file.size)}
                </div>
            )}
            <div css={tw`w-1/5 text-right mr-4 hidden md:block font-mono text-xs text-[#A89F9F]`} title={file.modifiedAt.toString()}>
                {Math.abs(differenceInHours(file.modifiedAt, new Date())) > 48
                    ? format(file.modifiedAt, 'MMM do, yyyy h:mma')
                    : formatDistanceToNow(file.modifiedAt, { addSuffix: true })}
            </div>
        </Clickable>
        <FileDropdownMenu file={file} />
    </div>
);

export default memo(FileObjectRow, (prevProps, nextProps) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { isArchiveType, isEditable, ...prevFile } = prevProps.file;
    const { isArchiveType: nextIsArchiveType, isEditable: nextIsEditable, ...nextFile } = nextProps.file;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    return isEqual(prevFile, nextFile);
});
