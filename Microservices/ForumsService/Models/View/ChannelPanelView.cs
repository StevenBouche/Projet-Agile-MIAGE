using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ForumServices.Models.View
{
    public class ChannelPanelView
    {
        public ChannelView Channel {get; set;}

        public List<MessageView> Messages { get; set; }
    }
}
