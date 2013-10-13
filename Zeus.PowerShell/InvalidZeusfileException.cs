using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Zeus.PowerShell
{
    [Serializable]
    public class InvalidZeusfileException : Exception
    {
        public InvalidZeusfileException() { }
        public InvalidZeusfileException(string message) : base(message) { }
        public InvalidZeusfileException(string message, Exception inner) : base(message, inner) { }
        protected InvalidZeusfileException(
          SerializationInfo info,
          StreamingContext context)
            : base(info, context) { }
    }
}
