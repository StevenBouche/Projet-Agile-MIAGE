using ForumServices.Models.View;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ForumServices.Models
{
    public class Channel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonPropertyName("_id")]
        public string Id { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("messages")]
        public List<Message> Messages { get; set; }

        public ChannelView ToChannelView()
        {
            return new ChannelView
            {
                Id = this.Id,
                Name = this.Name
            };
        }
    }
}