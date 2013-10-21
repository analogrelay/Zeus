using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ZeusfileViewer
{
    public class ParseTreeNode
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public IList<ParseTreeNode> Children { get; set; }
        public bool IsExpanded { get; set; }

        public ParseTreeNode(string name) : this(name, String.Empty) { }
        public ParseTreeNode(string name, string value)
        {
            Name = name;
            Value = value;
            Children = new List<ParseTreeNode>();
            IsExpanded = true;
        }
    }
}
