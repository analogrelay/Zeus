parser grammar ZeusfileParser;
import ZeusParserBase;

options {
	tokenVocab = ZeusLexer;
}

zeusfile
	: (zeusfile_statement|EOL)* EOF
	;

zeusfile_statement
	: uses_statement EOL?
	| service_block
	;

uses_statement
	: USES name
	;

service_block
	: service_definition EOL?
	| service_definition EOL (INDENT role* DEDENT)?
	;

service_definition
	: SERVICE name
	;

role
	: role_definition EOL?
	| role_definition EOL (INDENT resource* DEDENT)?
	;

role_definition
	: ROLE name IS name
	;