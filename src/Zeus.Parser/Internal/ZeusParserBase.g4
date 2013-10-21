parser grammar ZeusParserBase;
@namespace{Zeus.Parser.Internal}

options {
	tokenVocab = ZeusLexer;
}

@header {
	using Zeus.Model;
}

@members
{
	protected const int EOF = Eof;
}

resource[IList<ServiceRoleResource> container]
	: resource_definition EOL INDENT (resource[$resource_definition.Resource.Resources])+ DEDENT { $container.Add($resource_definition.Resource); }
	| resource_definition EOL { $container.Add($resource_definition.Resource); }
	| resource_definition { $container.Add($resource_definition.Resource); }
	;

resource_definition returns [ServiceRoleResource Resource = new ServiceRoleResource()]
	: name value { $Resource.Name = $name.Name; $Resource.Value = $value.ConvertedValue; }
	| name { $Resource.Name = $name.Name; }
	;

name returns [string Name]
	: name_part name_sep name { $Name = $name_part.text + $name_sep.text + $name.Name; }
	| name_part { $Name = $name_part.text; }
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

value returns [object ConvertedValue]
	: single_value ',' value { $ConvertedValue = CombineValues($single_value.ConvertedValue, $value.ConvertedValue); }
	| single_value { $ConvertedValue = $single_value.ConvertedValue; }
	;


single_value returns [object ConvertedValue]
	: name { $ConvertedValue = $name.text; }
	| STRING { $ConvertedValue = ReadQuotedString($STRING.text); }
	| NUMBER { $ConvertedValue = ParseNumber($NUMBER.text); }
	| '(' value ')' { $ConvertedValue = $value.ConvertedValue; }
	;

id_or_keyword
	: IDENTIFIER
	| SERVICE
	| ROLE
	| IS
	| ENVIRONMENT
	| FOR
	;