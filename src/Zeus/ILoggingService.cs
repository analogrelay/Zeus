using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;

namespace Zeus
{
    public interface ILoggingService
    {
        Logger GetLogger(string name);
    }
}
