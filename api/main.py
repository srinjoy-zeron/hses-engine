from api.imports import logging
from api.app import app


logging.basicConfig(filename = "logs.log", level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# use this below only in local dev
# uvicorn api.app:app --env-file api/.env --reload -> run this command in project root to start the server
# if __name__ == "__main__":
#     uvicorn.run("hses:app", host = "127.0.0.1", port = 8000, reload = True)

