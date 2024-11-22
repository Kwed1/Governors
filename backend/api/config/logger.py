import logging
import os
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler

ENV = os.getenv("ENV", "development")


class LoggerSetup:
    @staticmethod
    def prepare():
        logger = logging.getLogger("app_logger")
        # logger.setLevel(logging.DEBUG if os.getenv("ENV", "development") == "development" else logging.ERROR)

        if os.getenv("ENV", "development") == "development":
            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.DEBUG)
            console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            console_handler.setFormatter(console_formatter)
            logger.addHandler(console_handler)
        # else:
        log_dir = "./logs"
        os.makedirs(log_dir, exist_ok=True)
        today = datetime.today()
        log_date_str = today.strftime("%Y-%m-%d")
        log_file_path = os.path.join(log_dir, f"errors_{log_date_str}.log")

        file_handler = TimedRotatingFileHandler(log_file_path, when="midnight", interval=1)
        file_handler.suffix = "%Y-%m-%d"
        file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)

        return logger
