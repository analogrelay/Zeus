using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus
{
    /// <summary>
    /// Represents a service in the Zeus system
    /// </summary>
    public class ServiceModel
    {
        public string Name { get; set; }
        public ICollection<Role> Roles { get; private set; }

        public ServiceModel()
        {
            Roles = new List<Role>();
        }

        public ServiceModel(string name) : this()
        {
            Name = name;
        }
    }
}
