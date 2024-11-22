class CustomException(Exception):
    def __init__(self, message, error_code=500):
        super().__init__(message)
        self.error_code = error_code

    def __str__(self):
        return f"{self.args[0]} (Error Code: {self.error_code})"
