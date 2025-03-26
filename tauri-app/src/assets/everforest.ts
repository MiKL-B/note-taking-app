import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// Everforest Color Palette
// Background Colors
const background = '#2c323c', // dark background
  foreground = '#d3c6aa', // light text
  cursor = '#e9d3b8', // cursor color
  selection = '#3c4a5d' // selection background

// Syntax Colors
const keyword = '#f7bb3b', // Keyword color
  variable = '#84a0cb', // Variable color
  functionColor = '#9dba7f', // Function color
  stringColor = '#ccff00', // String color
  numberColor = '#d3869b', // Number color 
  commentColor = '#7a7a7a', // Comment color 
  typeColor = '#f77e3e', // Type color
  tagNameColor = '#d65d0e', // Tag name
  attributeColor = '#94b557', // Attribute color
  invalidColor = '#ff0000'; // Invalid color

// The editor theme styles for Everforest.
export const everforestTheme = EditorView.theme(
  {
    '&': {
      color: foreground,
      backgroundColor: background
    },

    '.cm-content': {
      caretColor: cursor
    },

    '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: selection },

    '.cm-panels': { backgroundColor: background, color: foreground },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid ' + foreground },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid ' + foreground },

    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: `1px solid ${foreground}`
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: selection
    },

    '.cm-activeLine': { backgroundColor: selection },
    '.cm-selectionMatch': { backgroundColor: selection },

    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      outline: `1px solid ${foreground}`
    },

    '&.cm-focused .cm-matchingBracket': {
      backgroundColor: background
    },

    '.cm-gutters': {
      backgroundColor: background,
      color: foreground,
      border: 'none'
    },

    '.cm-activeLineGutter': {
      backgroundColor: selection
    },

    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd'
    },

    '.cm-tooltip': {
      border: 'none',
      backgroundColor: selection
    },
    
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent'
    },
    
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: selection,
      borderBottomColor: selection
    },
    
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: selection,
        color: foreground
      }
    }
  },
  { dark: true }
)

// The highlighting style for code in the Everforest theme.
export const everforestHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: keyword },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: attributeColor },
  { tag: [t.variableName], color: variable },
  { tag: [t.function(t.variableName)], color: functionColor },
  { tag: [t.labelName], color: tagNameColor },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: functionColor },
  { tag: [t.definition(t.name), t.separator], color: typeColor },
  { tag: [t.brace], color: foreground },
  { tag: [t.annotation], color: invalidColor },
  { tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: numberColor },
  { tag: [t.typeName, t.className], color: typeColor },
  { tag: [t.operator, t.operatorKeyword], color: foreground },
  { tag: [t.tagName], color: tagNameColor },
  { tag: [t.squareBracket], color: keyword },
  { tag: [t.angleBracket], color: variable },
  { tag: [t.attributeName], color: attributeColor },
  { tag: [t.regexp], color: functionColor },
  { tag: [t.quote], color: commentColor },
  { tag: [t.string], color: stringColor },
  { tag: t.link, color: foreground, textDecoration: 'underline', textUnderlinePosition: 'under' },
  { tag: [t.url, t.escape, t.special(t.string)], color: stringColor },
  { tag: [t.meta], color: numberColor },
  { tag: [t.comment], color: commentColor, fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold', color: functionColor },
  { tag: t.emphasis, fontStyle: 'italic', color: functionColor },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.heading, fontWeight: 'bold', color: functionColor },
  { tag: t.special(t.heading1), fontWeight: 'bold', color: functionColor },
  { tag: t.heading1, fontWeight: 'bold', color: functionColor },
  { tag: [t.heading2, t.heading3, t.heading4], fontWeight: 'bold', color: functionColor },
  { tag: [t.heading5, t.heading6], color: functionColor },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: attributeColor },
  { tag: [t.processingInstruction, t.inserted], color: foreground },
  { tag: [t.contentSeparator], color: typeColor },
  { tag: t.invalid, color: commentColor, borderBottom: `1px dotted ${invalidColor}` }
])

// Extension to enable the Everforest theme (both the editor theme and the highlight style).
export const everforest: Extension = [
  everforestTheme,
  syntaxHighlighting(everforestHighlightStyle)
]