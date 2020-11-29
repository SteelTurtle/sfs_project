import argparse
import re

import requests

parser = argparse.ArgumentParser()
parser.add_argument('-c', '--command',
                    type=str,
                    default='GET',
                    help='HTTP verb used to call the  API endpoint. GET | POST | DELETE are '
                         'supported. If not specified, default will be GET')
parser.add_argument('-u', '--url', required=True, help='URL of the file server API endpoint')
parser.add_argument('-f', '--file', type=str, help='Numeric id of the file to download')
args = vars(parser.parse_args())

http_verb = args['command']
api_url = args['url']
file_id = args['file']


def _get_content(cd_header):
    if not cd_header:
        return None
    file_name = re.findall('filename=(.+)', cd_header)
    if len(file_name) == 0:
        return None
    return file_name[0]


if file_id is not None and http_verb == 'GET':
    print('Download Starting...')
    url = 'http://localhost:8080/media/pragmatic-metrics-examples.ods'
    r = requests.get(url)
    filename = url.split('/')[-1]  # this will take only -1 splitted part of the url
    with open(filename, 'wb') as output_file:
        output_file.write(r.content)
    print('Download Completed!!!')
