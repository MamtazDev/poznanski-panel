import React from 'react';
import {AnyExtension, NodeViewWrapper, mergeAttributes, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import YouTube from '@tiptap/extension-youtube';
import {FileResizer} from '../ImageFileResizer/ImageFileResizer';
import FileHandler from '@tiptap-pro/extension-file-handler';
import {FileFromEditor, TipTapProps} from './TipTap';
import {convertToEmbedLink, getFileData} from './helpers';
import {text} from 'stream/consumers';
import ReactDOM from 'react-dom';

function getYouTubeThumbnail(url: string) {
	let videoId: string | null = '';

	// Extract video ID from standard YouTube URL
	if (url.includes('youtube.com/watch?v=')) {
		const urlParams = new URLSearchParams(new URL(url).search);
		videoId = urlParams.get('v');
	}
	// Extract video ID from shortened YouTube URL
	else if (url.includes('youtu.be/')) {
		videoId = url.split('youtu.be/')[1];
	}

	// Return the thumbnail URL
	if (videoId) {
		return `https://img.youtube.com/vi/${videoId}/0.jpg`;
	}

	// Return null if no valid video ID was found
	return null;
}

const getYouTubeVideoId = (url: string) => {
	let videoId: string | null = '';

	// Extract video ID from standard YouTube URL
	if (url.includes('youtube.com/watch?v=')) {
		const urlParams = new URLSearchParams(new URL(url).search);
		videoId = urlParams.get('v');
	}
	// Extract video ID from shortened YouTube URL
	else if (url.includes('youtu.be/')) {
		videoId = url.split('youtu.be/')[1];
	}

	// Return the thumbnail URL
	if (videoId) {
		return `${videoId}`;
	}

	// Return null if no valid video ID was found
	return null;
};





export const customYouTubeArticle = YouTube.configure({
	height: 240,
	width: 320,
	addPasteHandler: true,
	disableKBcontrols: true,
	HTMLAttributes: {
		class: 'editor-youtube',
	},
}).extend({
	renderHTML({node, HTMLAttributes}) {
		return [
			'div',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: 'text-center',
				text: 'center',
				style: 'height: 120px; margin: 2rem 0;',
			}),
			[
				'img',
				mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
					src: getYouTubeThumbnail(node.attrs.src),
					class: 'mx-auto',
					style: 'height: 120px; width: 160px; border: 1px solid #ffffff; border-radius: 8px;',
					// value: convertToEmbedLink(node.attrs.src),
				}),
			],
			[
				'div',
				{
					class: 'relative',
					style: 'top: -25px; z-index: 10; width: 100%;',
				},
				[
					'p',
					{
						class: 'yt-play-button relative cursor-pointer text-white text-sm bg-black p-2 border-2 border-gray-300',
						style: 'width: 110px; padding: 5px; border-bottom: 1px solid #ffffff; border-radius: 8px; margin: 0 auto; background-color: #000000; font-family: "Urbanist", sans-serif;',
                        value: getYouTubeVideoId(node.attrs.src),
					},
					'ODTWÓRZ',
				],
			],
		];
	},
});




export const customFileHandler = (setFiles: TipTapProps['setFiles']) =>
	FileHandler.configure({
		allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
		onDrop: (currentEditor, files, pos) => {
			files.forEach(async (file) => {
				const compressedFile = await FileResizer(file);
				if (!compressedFile) return;
				const fileToAdd = getFileData(file, compressedFile);
				currentEditor
					.chain()
					.focus()
					.setImage({src: fileToAdd.url, alt: fileToAdd.name})
					.run();
				setFiles?.((prev) => {
					URL.revokeObjectURL(fileToAdd.url);
					if (!prev) {
						return [fileToAdd];
					}
					return [...prev, fileToAdd];
				});
			});
		},
		onPaste: (currentEditor, files, htmlContent) => {
			console.log('html: ', htmlContent);
			files.forEach(async (file) => {
				const compressedFile = await FileResizer(file);
				if (!compressedFile) return;
				const fileToAdd = getFileData(file, compressedFile);
				currentEditor
					.chain()
					.focus()
					.setImage({src: fileToAdd.url, alt: fileToAdd.name})
					.run();
				setFiles?.((prev) => {
					URL.revokeObjectURL(fileToAdd.url);
					if (!prev) {
						return [fileToAdd];
					}
					return [...prev, fileToAdd];
				});
			});
		},
	});
