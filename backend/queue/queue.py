# @queue.post("/urls")
def add_urls():
    try:
        # process file get URLs
        urls = []
        for url in urls:
            add_url(url)
        return "success"
    except:
        return "failure"


# @queue.post("/url")
def add_url():
    # send each url to message queue
    pass
