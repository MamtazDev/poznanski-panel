// In your TipTap extensions file
import { Node } from '@tiptap/core';

export const customYouTubeArticle = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('data-youtube-id'),
      },
    };
  },

  parseHTML() {
    return [{
      tag: 'div.editor-youtube',
      getAttrs: (dom) => {
        const img = dom.querySelector('img');
        return {
          src: img ? img.src.match(/vi\/(.+?)\//)?.[1] : null
        };
      }
    }];
  },

  renderHTML({ node }) {
    const videoId = node.attrs.src;
    return [
      'div',
      {
        class: 'editor-youtube',
        'data-youtube-id': videoId,
        style: 'margin: 2rem 0;'
      },
      [
        'img',
        {
          src: `https://img.youtube.com/vi/${videoId}/0.jpg`,
          style: 'height: 120px; width: 160px; border: 1px solid #ffffff; border-radius: 8px;',
          class: 'mx-auto'
        }
      ],
      [
        'div',
        {
          class: 'relative',
          style: 'top: -25px; z-index: 10; width: 100%;'
        },
        [
          'p',
          {
            class: 'yt-play-button',
            style: 'width: 110px; padding: 5px; margin: 0 auto; background-color: #000000;',
            value: videoId
          },
          'ODTWÓRZ'
        ]
      ]
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo: (src) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { src },
        });
      },
    };
  },
});