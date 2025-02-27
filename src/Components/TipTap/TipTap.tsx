import React, {useEffect, useRef} from 'react';
import Image from '@tiptap/extension-image';
import {AnyExtension, EditorContent, useEditor} from '@tiptap/react';
import styles from './TipTap.module.css';
import {Box} from '@chakra-ui/react';
import {FileResizer} from '../ImageFileResizer/ImageFileResizer';
import {MenuBar} from './MenuBar';
import {getFileData, getFilesIncludedInHTML} from './helpers';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {customYouTubeArticle, customFileHandler} from './Extensions';
import { openPlayer } from '../../reducers/PlayerReducer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../reducers';
// import {HTML} from "@tiptap/extension-html"

export interface TipTapProps {
	onVideoAdd?: (videoUrl: string) => void;
	type?: boolean;
	setFiles?: React.Dispatch<React.SetStateAction<FileFromEditor[] | null>>;
	setArticle?: React.Dispatch<React.SetStateAction<string>>;
	onSubmit?: () => void;
	themeMode?: boolean;
	editable?: boolean;
	content?: string;
}

type imageFromEditor = {
	[key: string]: File;
};

export type FileFromEditor = {
	name: string;
	size: number;
	file: Blob;
	url: string;
};

export const getExtensionsData = (
	setFiles: TipTapProps['setFiles']
): AnyExtension[] => [
	StarterKit,
	TextAlign.configure({
		types: ['heading', 'paragraph'],
	}),
		Image.configure({
		HTMLAttributes: {
			class: 'mx-auto my-3 max-h-[494px] object-cover',
			style: `border-radius: 16px; border: 1px solid #e5e7eb;`
		},
	}),
	customYouTubeArticle,
	Link.configure({
		validate: (href) => /^https?:\/\//.test(href),
		autolink: true,
		HTMLAttributes: {
			class: 'editor-link',
			style: 'text-decoration: underline; cursor: pointer;',
		},
	}),
	customFileHandler(setFiles),
];

const TipTap: React.FC<TipTapProps> = ({
	onVideoAdd,
	type,
	setArticle,
	setFiles,
	onSubmit,
	themeMode,
	editable = true,
	content = '',
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch<AppDispatch>();
	const onEditorUpdate = (htmlString: string) => {
		if (setArticle && setFiles) {
			setArticle(htmlString);
			setFiles((prev) => {
				if (!prev) {
					return null;
				}
				return getFilesIncludedInHTML(htmlString, prev);
			});
		}
	};

	const editor = useEditor({
		// extensions: [StarterKit, HTML],
		extensions: getExtensionsData(setFiles),
		content,
		onUpdate: ({editor}) => {
			const html = editor.getHTML();
			return onEditorUpdate(html);
		},
		editable,
	});

	const handleVideoAdd = () => {
		const videoUrl = prompt('Enter YouTube video URL:');
		if (videoUrl) {
			onVideoAdd?.(videoUrl);
			editor?.chain().focus().setYoutubeVideo({src: videoUrl}).run();
			editor?.commands.newlineInCode();
		}
	};

	const handleImgAdd = async (file: File) => {
		if (setFiles) {
			const compressedFile = await FileResizer(file);
			if (compressedFile) {
				const fileToAdd = getFileData(file, compressedFile);
				editor
					?.chain()
					.focus()
					.setImage({src: fileToAdd.url, alt: fileToAdd.name})
					.run();
				setFiles((prev) => {
					URL.revokeObjectURL(fileToAdd.url);
					if (!prev) {
						return [fileToAdd];
					}
					return [...prev, fileToAdd];
				});
				editor?.commands.newlineInCode();
			}
		}
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			await handleImgAdd(file);
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const additionalButtons = [
		<button className={styles.editorButton} onClick={handleVideoAdd}>
			YouTube
		</button>,
		<button className={styles.editorButton} onClick={handleClick}>
			zdjęcie
		</button>,
	];

	const handlePlayButton = (event: MouseEvent) => {
		const target = event.target as Element;
		if (target.closest('.yt-play-button')) {
			dispatch(openPlayer(`${target.getAttribute('value')}`));
		}
	};

	useEffect(() => {
		window.addEventListener('click', (event) => handlePlayButton(event));

		return () => {
			window.removeEventListener('click', (event) =>
				handlePlayButton(event)
			);
		};
	}, []);

	return (
		<>
			<div className={styles.tiptap}>
				
						<div
							className={`block mb-2 text-left ${themeMode ? 'text-gray-900' : 'text-white'} `}
							style={{fontSize: type ? '14px' : '18px'}}
						>
							{editable && (
								<p className='label-text'>
									Treść Twojego newsa
								</p>
							)}
							{editor && (
								<MenuBar
									editor={editor}
									additionalButtons={additionalButtons}
								/>
							)}
						</div>

						<Box
							sx={{
								'&& .ProseMirror': {
									height: editable ? '270px' : 'auto',
									overflowY: 'auto',
									border: editable
										? `1px solid ${themeMode ? '' : '#e5e7eb86'}`
										: 'none',
									backgroundColor: editable
										? `${themeMode ? '#E9E9EB' : 'rgb(36, 37, 38)'}`
										: themeMode
											? '#ffffff'
											: 'rgb(17, 18, 23)',
									color: `${!themeMode ? '#BBBCC0' : '#6D6E76'}`,
									borderRadius: '7px',
								},
							}}
						>
							<EditorContent
								className={styles.editorContent}
								editor={editor}
							/>
						</Box>
						<input
							type='file'
							accept='image/png'
							onChange={handleFileChange}
							ref={fileInputRef}
							style={{display: 'none'}}
						/>
				
				
				{/* <p>Editable: {editable} Done</p>
				<div className={!themeMode ?'text-stone-400' : 'text-stone-500'} dangerouslySetInnerHTML={{__html: content}} /> */}
			</div>
		</>
	);
};

export default TipTap;
