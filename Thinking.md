# Thoughts
- DB design: model,mock profile, 
- API structuring
- Code quality
- Code architecture
- Optimizations
- Caching
- Extensibility



model: profilepic: image, name:char,age:int,pronouns:string, locationstring, linkedin link, pitch video, faq(map, key being question, value being the answer),

% match()

API structuring: /topMatches: gives top 10 matches based on match %


Actions: a user's action would be stored for each profile they encounter, it will be a feild with a reference to the user that 