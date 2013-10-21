using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Parser.Internal
{
    static class ParserHelper
    {
        internal static string ReadQuotedString(string quoted)
        {
            return quoted;
        }

        internal static object ParseNumber(string number)
        {
            return Decimal.Parse(number);
        }

        internal static IEnumerable<object> CombineValues(object left, object right)
        {
            return Enumerable.Concat(ToEnum(left), ToEnum(right));
        }

        private static IEnumerable<object> ToEnum(object item)
        {
            IEnumerable<object> enumerable = item as IEnumerable<object>;
            if (enumerable == null)
            {
                yield return item;
            }
            else
            {
                foreach (var i in enumerable)
                {
                    yield return i;
                }
            }
        }
    }
}
