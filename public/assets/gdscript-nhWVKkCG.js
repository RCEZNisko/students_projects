import{g as p}from"./index-D2cTiFtH.js";function d(e,s){for(var a=0;a<s.length;a++){const t=s[a];if(typeof t!="string"&&!Array.isArray(t)){for(const r in t)if(r!=="default"&&!(r in e)){const n=Object.getOwnPropertyDescriptor(t,r);n&&Object.defineProperty(e,r,n.get?n:{enumerable:!0,get:()=>t[r]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var o,i;function l(){if(i)return o;i=1,o=e,e.displayName="gdscript",e.aliases=[];function e(s){s.languages.gdscript={comment:/#.*/,string:{pattern:/@?(?:("|')(?:(?!\1)[^\n\\]|\\[\s\S])*\1(?!"|')|"""(?:[^\\]|\\[\s\S])*?""")/,greedy:!0},"class-name":{pattern:/(^(?:class|class_name|extends)[ \t]+|^export\([ \t]*|\bas[ \t]+|(?:\b(?:const|var)[ \t]|[,(])[ \t]*\w+[ \t]*:[ \t]*|->[ \t]*)[a-zA-Z_]\w*/m,lookbehind:!0},keyword:/\b(?:and|as|assert|break|breakpoint|class|class_name|const|continue|elif|else|enum|export|extends|for|func|if|in|is|master|mastersync|match|not|null|onready|or|pass|preload|puppet|puppetsync|remote|remotesync|return|self|setget|signal|static|tool|var|while|yield)\b/,function:/\b[a-z_]\w*(?=[ \t]*\()/i,variable:/\$\w+/,number:[/\b0b[01_]+\b|\b0x[\da-fA-F_]+\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.[\d_]+)(?:e[+-]?[\d_]+)?\b/,/\b(?:INF|NAN|PI|TAU)\b/],constant:/\b[A-Z][A-Z_\d]*\b/,boolean:/\b(?:false|true)\b/,operator:/->|:=|&&|\|\||<<|>>|[-+*/%&|!<>=]=?|[~^]/,punctuation:/[.:,;()[\]{}]/}}return o}var c=l();const u=p(c),f=d({__proto__:null,default:u},[c]);export{f as g};
