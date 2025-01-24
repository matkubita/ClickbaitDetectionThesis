# Bachelor thesis at Warsaw University of Technology

## Authors
[Tymoteusz Urban](https://github.com/tymsoncyferki)<br>
[Mateusz Kubita](https://github.com/matkubita)<br>
[Wojciech Michaluk](https://github.com/wojo501)

## Clickbait News Detection and Analysis

This engineering thesis presents an analysis of clickbait articles using machine learning and artificial intelligence methods. The team conducted a review of existing research in this area, which allowed the creation of a custom metric, referred to in the thesis as the *baitness measure*, which quantifies the clickbait nature of articles.

Natural language processing techniques were applied to find patterns that allow the classification of articles into the clickbait category based on their titles. Machine learning models were built using vectorized text representations for clickbait classification. Large language models based on the transformer architecture were used to process the text into vectors. Generative artificial intelligence was employed to summarize suspicious articles so that users could quickly determine whether the article’s content is worth their attention.

Among the applied machine learning models, the best overall was **XGBoost**, which combined informativeness measures with embeddings generated using OpenAI, achieving the highest F1-score of **91%**.

To showcase the results, a fully functional browser extension was developed for chromium-based browsers. This tool is capable of warning users both before and after they access a clickbait article. After opening an article, the user receives a percentage score indicating the likelihood of the article being a clickbait. The prediction is explained based on the analyzed metrics, including those developed by the team. A one- to two-sentence summary of the entire article is also provided.


## How to Set Up the Environment with Conda:
1. Clone or navigate to the project directory:
    ```bash
    cd ClickbaitDetectionThesis/environments
    ```

2. Create the Conda environment using the `main_env.yaml` file (respectively for eda_env):
    ```bash
    conda env create -f main_env.yaml
    ```

3. Activate the environment:
    ```bash
    conda activate main_env
    ```

4. Once the environment is activated, you can start working with the project.

## Content of the project:
- **api** - Python API files for backend service for the browser extension.
- **data** - Directory containing both original and preprocessed data.
- **environments** - Environment files.
- **extension** - JavaScript files for fully functional web browser extension.
- **final_models** - Final models used in browser extension.
- **notebooks** - Jupyter Notebooks with Python code.
    - **0-Function-Helper** - Definitions of frequently used functions.
    - **1-Getting-Data** - Downloading, saving, merging data. Data pre-cleaning.
    - **2-EDA** - Exploratory data analysis.
    - **2.1-Creating_dataset_[dataset_name]** - Creating final dataset for model training.
    - **2.5-Dummy-Classifier** - Tests with dummy classifier. Ground to compare with other models.
    - **3-Informativeness-Measures** - Checking metrics for clickbait detection. Custom metric foundation.
    - **4-TFIDF-Trivial** - TFIDF base model.
    - **5-TFIDF_Traditional_ML_Models** - Comparison of TFIDF on cleaned and raw datasets.
    - **6-Word-Embedding-Models** - Word2vec, GloVe models.
    - **7.5-LLM-OPENAI** - Embeddings from OpenAI for machine learning models.
    - **8-BERT-Detection** - BERT model for clickbait detection task.
    - **8.5-BERT-Spoiling** - Fine-tuned RoBERTa and T5-Large models for clickbait spoiling tasks.
    - **9-OPENAI-Spoiling** - OpenAI models for spoiling tasks.
- **other** - Code with minor functionalities.