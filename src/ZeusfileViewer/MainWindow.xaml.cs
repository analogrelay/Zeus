using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Antlr4.Runtime;
using Zeus.Parser;

namespace ZeusfileViewer
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public static readonly DependencyProperty TokensProperty = DependencyProperty.Register("Tokens", typeof(IEnumerable<Token>), typeof(MainWindow));
        public static readonly DependencyProperty ParseTreeProperty = DependencyProperty.Register("ParseTree", typeof(IEnumerable<ParseTreeNode>), typeof(MainWindow));
        public static readonly DependencyProperty ErrorsProperty = DependencyProperty.Register("Errors", typeof(IEnumerable<string>), typeof(MainWindow));
        
        public IEnumerable<Token> Tokens
        {
            get { return (IEnumerable<Token>)GetValue(TokensProperty); }
            set { SetValue(TokensProperty, value); }
        }

        public IEnumerable<ParseTreeNode> ParseTree
        {
            get { return (IEnumerable<ParseTreeNode>)GetValue(ParseTreeProperty); }
            set { SetValue(ParseTreeProperty, value); }
        }

        public IEnumerable<string> Errors
        {
            get { return (IEnumerable<string>)GetValue(ErrorsProperty); }
            set { SetValue(ErrorsProperty, value); }
        }

        public MainWindow()
        {
            InitializeComponent();
            ParseDocument();
        }

        private void TextBox_KeyUp(object sender, KeyEventArgs e)
        {
            ParseDocument();
        }

        private void ParseDocument()
        {
            // Parse the document
            ZeusLexer l = new ZeusLexer(new StringReader(SourceTextBox.Text));
            var strm = new BufferedTokenStream(l);
            ZeusfileParser p = new ZeusfileParser(strm);
            var errorCollector = new ErrorCollector();
            p.AddErrorListener(errorCollector);
            var zf = p.zeusfile();
            ParseTree = new[] { zf.Accept(new TreeBuilderVisitor()) };
            Errors = errorCollector.Errors;

            // Grab tokens
            Tokens = strm.GetTokens().Select(t => new Token(t));
        }
    }
}

