import json


class AttrDict(dict):
    def __init__(self, *args, **kwargs):
        super(AttrDict, self).__init__(*args, **kwargs)
        self.__dict__ = self


def open_config_file(filepath):
    """
    Function to open a json file and return the parameters as a dictionary.
    :param filepath = path to the json file
    :return params = dictionary containing the parameters
    """
    with open(filepath) as jsonfile:
        pdict = json.load(jsonfile)
        params = AttrDict(pdict)
    return params
