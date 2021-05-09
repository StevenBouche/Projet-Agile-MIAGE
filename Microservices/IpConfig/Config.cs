using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace IpConfig
{
    public class Config
    {

        public string DevHostName { get; set; }
        public string ProdHostName { get; set; }

        public static bool IsDev = true;
        public static string URL = IsDev ? "http://localhost:4001/api" : "http://51.210.181.145:7000";

    }
}
