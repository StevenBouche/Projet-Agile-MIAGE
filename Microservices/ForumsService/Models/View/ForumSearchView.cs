using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ForumServices.Models.View
{
    public class ForumSearchView
    {
        [JsonPropertyName("totalItem")]
        public int TotalItem { get; set; }
        [JsonPropertyName("totalPage")]
        public int TotalPage { get; set; }
        [JsonPropertyName("currentPage")]
        public int CurrentPage { get; set; }
        [JsonPropertyName("nbItemPerPage")]
        public int NbItemPerPage { get; set; }
        [JsonPropertyName("nameFilter")]
        public string NameFilter { get; set; }
        [JsonPropertyName("sescFilter")]
        public string DescFilter { get; set; }
        [JsonPropertyName("forumSearch")]
        public List<ForumView> ForumSearch { get; set; }
        [JsonPropertyName("totalItemCurrent")]
        public int TotalItemCurrent { get; internal set; }
    }
}
