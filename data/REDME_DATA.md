- cc_dataset_balanced.csv
columns: title, body, clickbait
purpose: metrics, deep learning

- clickbait_data.csv
columns: headline,clickbait
purpose: https://www.kaggle.com/datasets/amananandrai/clickbait-dataset

- merged_all_datasets.csv
columns: title,clickbait
purpose: unknown

- merged_datasetes_balanced.csv
columns: title, body, clickbait
purpose: eda, metrics, balanced for easier usage

- merged_datasetes_balanced_huge.csv
columns: title, body, clickbait
purpose: for training bigger models (deep learning)

- spoiling_data.csv
columns: targetTitle,targetParagraphs,humanSpoiler,spoiler,spoilerPositions,tags
purpose: clickbait spoiling feature

- train2.csv
columns: label,title
purpose: https://www.kaggle.com/datasets/vikassingh1996/news-clickbait-dataset?select=train2.csv