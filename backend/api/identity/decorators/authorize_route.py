def authorized(func):
    func.authorized = True
    return func
