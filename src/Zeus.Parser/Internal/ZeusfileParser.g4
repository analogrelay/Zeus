parser grammar ZeusfileParser;
import ZeusParserBase;

options {
	tokenVocab = ZeusLexer;
}

zeusfile returns [IList<ServiceModel> Services = new List<ServiceModel>()]
	: (zeusfile_statement[$Services]|EOL)* EOF
	;

zeusfile_statement[IList<ServiceModel> services]
	: service { $services.Add($service.Service); }
	;

service returns [ServiceModel Service = new ServiceModel()]
	: service_definition[$Service] EOL INDENT role_list[$Service.Roles] DEDENT
	| service_definition[$Service] EOL
	| service_definition[$Service]
	;

role_list[IList<ServiceRole> roles]
	: role role_list[$roles] { $roles.Insert(0, $role.Role); }
	| role { $roles.Insert(0, $role.Role); }
	;

service_definition[ServiceModel s]
	: SERVICE name { $s.Name = $name.Name; }
	;

role returns [ServiceRole Role = new ServiceRole()] 
	: role_definition[$Role] EOL INDENT (resource[$Role.Resources])* DEDENT
	| role_definition[$Role] EOL
	| role_definition[$Role]
	;

role_definition[ServiceRole r]
	: ROLE n=name IS t=name { $r.Name = $n.text; $r.Type = $t.text; }
	;