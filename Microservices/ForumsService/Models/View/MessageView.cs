using System.Text.Json.Serialization;

namespace ForumServices.Models.View
{
    public class MessageView
    {

        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("value")]
        public string Value { get; set; }
        [JsonPropertyName("timestamp")]
        public double Timestamp { get; set; }
        [JsonPropertyName("userId")]
        public string UserId{ get; set; }

    }
}