parser grammar ZeusParserBase;

options {
	tokenVocab = ZeusLexer;
}

@members
{
	protected const int EOF = Eof;
}

resource
	: resource_definition EOL?
	| resource_definition EOL (INDENT resource+ DEDENT)?
	;

resource_definition
	: name value?
	;

name
	: name_part (name_sep name_part)* 
	;

name_sep
	: '.'
	| '::'
	| '-'
	;

name_part
	: id_or_keyword
	| STRING
	;

value
	: single_value (',' single_value)*
	;


single_value
	: id_or_keyword
	| STRING
	| NUMBER
	| '(' value ')'
	;

id_or_keyword
	: IDENTIFIER
	| SERVICE
	| ROLE
	| IS
	| ENVIRONMENT
	| FOR
	;