using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ForumServices.Models.View
{
    public class ForumPanelView
    {
        public ForumView Forum { get; set; } 
        public List<ChannelView> Channels { get; set; }
        public List<UserView> Users { get; set; }
    }

}
