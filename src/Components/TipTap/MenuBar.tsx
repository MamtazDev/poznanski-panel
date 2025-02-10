import styles from './TipTap.module.css';
import {ReactComponent as BulletListIcon} from '../../assets/svg/bullet-list-icon.svg';
import {ReactComponent as NumberedListIcon} from '../../assets/svg/numbered-list-icon.svg';
import {Editor} from '@tiptap/react';
import {useCallback} from 'react';

const LinkButtons: React.FC<{editor: Editor}> = ({editor}) => {
	const setLink = useCallback(() => {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		// update link
		editor
			.chain()
			.focus()
			.extendMarkRange('link')
			.setLink({href: url, target: '_blank'})
			.run();
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<>
			{editor.isActive('link') ? (
				<button
				type='button'
					className={styles.editorButton}
					onClick={() => editor.chain().focus().unsetLink().run()}
				>
					usuń linka
				</button>
			) : (
				<button
				type='button'
					onClick={setLink}
					className={[
						`${editor.isActive('link') ? styles.isActive : ''}`,
						styles.editorButton,
					].join(' ')}
				>
					dodaj linka
				</button>
			)}
		</>
	);
};

export const MenuBar: React.FC<{
	editor: Editor;
	additionalButtons: React.ReactElement[];
}> = ({editor, additionalButtons}) => {
	if (!editor) {
		return null;
	}

	return (
		<div className=''>
			<div className='flex'>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={[
						`${editor.isActive('bold') ? styles.isActive : ''}`,
						styles.editorButton,
					].join(' ')}
				>
					<b>b</b>
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={
						!editor.can().chain().focus().toggleItalic().run()
					}
					className={[
						`${editor.isActive('italic') ? styles.isActive : ''}`,
						styles.editorButton,
					].join(' ')}
				>
					<i>i</i>
				</button>
				<button
					type='button'
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={
						!editor.can().chain().focus().toggleStrike().run()
					}
					className={[
						`${editor.isActive('strike') ? styles.isActive : ''}`,
						styles.editorButton,
					].join(' ')}
				>
					<s>s</s>
				</button>

				<button
					type='button'
					onClick={() =>
						editor
							.chain()
							.focus()
							.toggleBulletList()
							.setTextAlign('justify')
							.run()
					}
					className={[
						`${editor.isActive('bulletList') ? styles.isActive : ''}`,
						styles.editorButton,
					].join(' ')}
				>
					<BulletListIcon
						fill={editor.isActive('bulletList') ? '#fff' : '#000'}
					/>
				</button>
				<button
					type='button'
					onClick={() =>
						editor
							.chain()
							.focus()
							.toggleOrderedList()
							.setTextAlign('justify')
							.run()
					}
					className={[
						`${editor.isActive('orderedList') ? styles.isActive : ''}`,
						styles.editorButton,
					].join(' ')}
				>
					<NumberedListIcon
						fill={editor.isActive('orderedList') ? '#fff' : '#000'}
					/>
				</button>
			</div>
			<div>
				<button
					type='button'
					onClick={() => editor.chain().focus().setParagraph().run()}
					className={[
						`${editor.isActive('paragraph') ? styles.isActive : ''}`,
						styles.editorButton,
					].join(' ')}
				>
					paragraf
				</button>
				<button
					type='button'
					onClick={() =>
						editor.chain().focus().toggleHeading({level: 5}).run()
					}
					className={[
						`${
							editor.isActive('heading', {level: 5})
								? styles.isActive
								: ''
						}`,
						styles.editorButton,
					].join(' ')}
				>
					podtytuł
				</button>
				<LinkButtons editor={editor} />
				<div>
					{additionalButtons}
					<button
						type='button'
						className={styles.editorButton}
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().chain().focus().undo().run()}
					>
						wstecz
					</button>
					<button
						type='button'
						className={styles.editorButton}
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().chain().focus().redo().run()}
					>
						naprzód
					</button>
				</div>
			</div>
		</div>
	);
};
