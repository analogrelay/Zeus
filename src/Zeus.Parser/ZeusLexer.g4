lexer grammar ZeusLexer;

@members {
	public const int HIDDEN = 1;
}

tokens {
	DEDENT
}

@namespace{Zeus.Parser}

// Operators
COMMA		: ',' ;
DOUBLECOLON	: '::' ;
LPAREN		: '(' ;
RPAREN		: ')' ;
EQUALS		: '=' ;
DOT			: '.' ;

// Keywords
//SERVICE		: 'service' ;
//ROLE		: 'role' ;
//IS			: 'is' ;
//ENVIRONMENT : 'environment' ;
//FOR			: 'for' ;

NUMBER
	: ('-'|'+')? ('0' ('x'|'X'))? [0-9]+ ('.' [0-9]+)? (('e'|'E')[0-9]+)?
	;

IDENTIFIER
	: LETTER (LETTER|IDENTIFIER_DIGIT)*
	;

EOL
	: ('\r\n' | '\n' | '\r') { HandleEol(); }
	;

INDENT
	: {Column==0}? WS { HandleIndent(); }
	;

WS  
	: [ \t\u000C]+ -> channel(HIDDEN)
    ;

STRING
	: '"' ( '\\"' | . )*? '"'
	| '\'' ( '\\\'' | . )*? '\''
	;

// Unicode Letters and "_"
fragment LETTER
	: '\u0041'..'\u005a' 
	| '\u005f' 
	| '\u0061'..'\u007a' 
	| '\u00c0'..'\u00d6' 
	| '\u00d8'..'\u00f6' 
	| '\u00f8'..'\u00ff' 
	| '\u0100'..'\u1fff' 
	| '\u3040'..'\u318f' 
	| '\u3300'..'\u337f' 
	| '\u3400'..'\u3d2d' 
	| '\u4e00'..'\u9fff' 
	| '\uf900'..'\ufaff'
    ;

// Unicode Digits (specifically those supported in identifiers)
fragment IDENTIFIER_DIGIT
    : '\u0030'..'\u0039' 
	| '\u0660'..'\u0669' 
	| '\u06f0'..'\u06f9' 
	| '\u0966'..'\u096f' 
	| '\u09e6'..'\u09ef' 
	| '\u0a66'..'\u0a6f' 
	| '\u0ae6'..'\u0aef' 
	| '\u0b66'..'\u0b6f' 
	| '\u0be7'..'\u0bef' 
	| '\u0c66'..'\u0c6f' 
	| '\u0ce6'..'\u0cef' 
	| '\u0d66'..'\u0d6f' 
	| '\u0e50'..'\u0e59' 
	| '\u0ed0'..'\u0ed9' 
	| '\u1040'..'\u1049'
	;