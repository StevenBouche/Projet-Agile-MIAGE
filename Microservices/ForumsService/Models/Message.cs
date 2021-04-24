using ForumServices.Models.View;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ForumServices.Models
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonPropertyName("_id")]
        public string Id { get; set; }
        [JsonPropertyName("value")]
        public string Value { get; set; }
        [JsonPropertyName("timestamp")]
        public double Timestamp { get; set; }
        [JsonPropertyName("userId")]
        public string UserId { get; set; }

        public MessageView ToMessageView()
        {
            return new MessageView
            {
                Id = this.Id,
                Value = this.Value,
                Timestamp = this.Timestamp,
                UserId = this.UserId
            };
        }
    }
}
