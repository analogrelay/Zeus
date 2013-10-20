parser grammar ZeusParserBase;

options {
	tokenVocab = ZeusLexer;
}

@members
{
	protected const int EOF = Eof;
}

compilation_unit
	: resource_list EOF
	;

resource_list
	: resource EOL? resource_list?
	;

resource
	: resource_definition (EOL subresource_block)?
	;

subresource_block
	: INDENT resource_list DEDENT
	;

resource_definition
	: IDENTIFIER value
	| IDENTIFIER name '=' value
	;

name
	: name_part
	| name_part '.' name
	| name_part '::' name
	;

name_part
	: IDENTIFIER
	| STRING
	;

value
	: single_value (',' single_value)*
	;


single_value
	: IDENTIFIER
	| STRING
	| NUMBER
	| '(' value ')'
	;
