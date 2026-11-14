const data = [
  {
    id: 1,
    author: "Alice Nguyen",
    text: "This movie was amazing!",
    replies: [
      {
        id: 2,
        author: "Bob Okafor",
        text: "I completely agree.",
        replies: [
          {
            id: 3,
            author: "Carol Mendez",
            text: "Especially the ending!",
            replies: []
          }
        ]
      },
      {
        id: 4,
        author: "Dave Whitfield",
        text: "I thought it was overrated.",
        replies: []
      }
    ]
  },
  {
    id: 5,
    author: "Eve Tanaka",
    text: "The soundtrack was incredible.",
    replies: []
  }
];

export default data