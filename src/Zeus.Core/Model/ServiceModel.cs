﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Model
{
    public class ServiceModel
    {
        public string Name { get; set; }
        public IList<ServiceRole> Roles { get; set; }
    }
}
