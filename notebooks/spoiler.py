import os
from openai import OpenAI
from dotenv import load_dotenv
import json

def get_spiler(api_key, title, article_text, model):
    client = OpenAI(api_key=api_key)
    
    system_prompt = f"""\
        You are a model designed to generate concise, short spoilers from articles as "spoiler".\
        Your task is to analyze the main question or topic posed by the article’s title ("title") and generate a spoiler based on the content provided in the article’s paragraphs ("article_text"). Your response must include a JSON object with the key "spoiler".\
        Guidelines:\
        1. Use "title" to determine the central question or topic the spoiler should address.\
        2. Review "article_text" to find the most relevant details that directly answer the question or topic posed in the title.\
        Example Answer: {{\
            "spoiler": "<A short, concise model-generated spoiler>"\
        }}\
        Example 1:\
        Input{{\
            "title": "Intellectual Stimulation Trumps Money For Employee Happiness, Survey Finds"\
            "article_text": 'Despite common belief, money is not the key to employee happiness, new research finds. A study by hiring software provider Cangrade revealed that being intellectually stimulated is the most important aspect of an employees job satisfaction. Specially, those surveyed said intellectual stimulation accounts for 18.5 percent of their job satisfaction. That Is compared to money, which accounts for just 5.4 percent of how happy an employee is with the job. Achievement and prestige, power and influence, work-life balance and affiliation and friendship were all rated more important to job satisfaction than money. These findings are quite surprising, because employers often assume things like income are the strongest drivers of happiness in the workplace, said Steve Lehr, Cangrade\\s chief science officer. In fact, our research shows that it may be the weakest. Researchers developed a three-part formula for employers who are eager to keep their staff happy: Try to ensure that jobs provide intellectual stimulation and task variety. Give employees some autonomy, influence and opportunities to acquire prestige and recognition. Employers should give employees these things even when they do not say they need them. Give them even more if they say they do. Employers should give all employees a break now and again, including the consummate workaholics who say they do not want or need it. Offer employees extra money, security and social opportunities. However, only to the extent they say these things matter to them. If there is a major takeaway here, it\\s that we can finally prove that money doesn\\t buy happiness, and that happiness isn\\t as elusive as we might think, said Cangrade CEO Michael Burtov. The study was based on surveys of nearly 600 YOU.S. employees.'\
        }}\
        \
        Output{{\
            "spoiler": 'Intellectual stimulation'\
        }}\
        \
        Example 2:\
        Input{{\
            "title": 'The Reason Why Gabor Kiraly Wears THOSE Trackie Bottoms',\
            "article_text": 'June 14th 2016 3.3K Shares, They may look like the sort of apparel you would usually sport on the morning after 12 pints, just so the elasticated waist can provide enough give to support two hangover curing trips to Maccy Ds and an evening Dominos, just for good measure, but Gabor Kiraly has made a name for himself by wearing grey tracksuit bottoms, as a professional footballer, for the last 16 years. But, why? Why would you favour a pair of pants that look like they might have been found in the lost property bin of a secondary school? Are they fused to him? Are his legs allergic to grass? Is he constantly hungover? In fact, the reason the oldest player at Euro 2016 wears those snazzy, grey marl bastards is down to a longstanding superstition or kabbalah, as he explained during an interview, in 2005: The more good games I had in them, the more I got used to them. I had many good games in them, especially at Hertha Berlin in the Champions League and with the Hungarian national team. Hell be hoping they provide Hungary with plenty of luck during the European Championships.'\
        }}\
        Output{{\
            "spoiler": 'Its a lucky charm to him'\
        }}\
        Pay attention to return valid JSON format!\
        """

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": f"{{title: '{title}', article_text: {article_text}}}"
                }
            ]
        )
        prediction_json = json.loads(response.choices[0].message.content)
        return prediction_json["spoiler"]
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def main(api_key, title, article_text, model):
    print(get_spiler(api_key, title, article_text, model))
    
if __name__ == "__main__":
    load_dotenv()
    api_key = os.getenv("OPEN_AI_KEY")
    model = "gpt-4o-mini"
    title = "Wes Welker Wanted Dinner With Tom Brady, But Patriots QB Had A Better Idea"
    article_text = "It will be just like old times this weekend for Tom Brady and Wes Welker. Welker revealed Friday morning on a Miami radio station that he contacted Brady because he will be in town for Sunday’s game between the New England Patriots and Miami Dolphins at Gillette Stadium. It seemed like a perfect opportunity for the two to catch up. But Brady’s definition of catching up involves far more than just a meal. In fact, it involves some literal catching as the Patriots quarterback looks to stay sharp during his four-game Deflategate suspension. I hit him up to do dinner Saturday night. He is like, ‘I am going to be flying in from Ann Arbor later (after the Michigan-Colorado football game) but how about that morning we go throw?  Welker said on WQAM, per The Boston Globe. And I am just sitting there, I am like, ‘I was just thinking about dinner, but yeah, sure. I will get over there early and we can throw a little bit. , Welker was one of Brady’s favorite targets for six seasons from 2007 to 2012. It is understandable him and Brady want to meet with both being in the same area. But Brady typically is all business during football season. Welker probably should have known what he was getting into when reaching out to his buddy. That is the only thing we really have planned, Welker said of his upcoming workout with Brady. It is just funny. I am sitting there trying to have dinner. ‘Hey, get your ass up here and let us go throw. I am like, ‘Aw jeez, man. He is going to have me running like 2-minute drills in his backyard or something. Maybe Brady will put a good word in for Welker down in Foxboro if the former Patriots wide receiver impresses him enough."
    
    main(api_key=api_key, 
        title=title, 
        article_text=article_text, 
        model=model)