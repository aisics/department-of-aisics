import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

export function rehypeCopyCode() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
        const codeElement = node.children[0];
        const codeText = getTextContent(codeElement);
        const language = getLanguage(codeElement);
        
        // Create the copy button
        const copyButton = h('button', {
          class: 'copy-btn absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white border border-gray-200 rounded-md p-1.5 shadow-sm',
          'data-copy-text': codeText,
          'aria-label': 'Copy code to clipboard',
          title: 'Copy code'
        }, [
          h('svg', {
            class: 'copy-icon w-4 h-4 text-gray-600',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          }, [
            h('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }),
            h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1' })
          ]),
          h('svg', {
            class: 'check-icon w-4 h-4 text-green-600 hidden',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          }, [
            h('polyline', { points: '20,6 9,17 4,12' })
          ])
        ]);
        
        // Wrap the pre element in a div with the copy button
        const wrapper = h('div', {
          class: 'relative group code-block-wrapper'
        }, [
          {
            ...node,
            properties: {
              ...node.properties,
              class: `${node.properties?.class || ''} code-block`.trim()
            }
          },
          copyButton
        ]);
        
        // Replace the pre element with the wrapper
        parent.children[index] = wrapper;
      }
    });
  };
}

function getTextContent(node) {
  if (node.type === 'text') {
    return node.value;
  }
  if (node.children) {
    return node.children.map(getTextContent).join('');
  }
  return '';
}

function getLanguage(codeElement) {
  const className = codeElement.properties?.className || [];
  const langClass = className.find(cls => cls.startsWith('language-'));
  return langClass ? langClass.replace('language-', '') : '';
}