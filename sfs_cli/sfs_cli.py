#!/usr/bin/env python3
import argparse
import logging
import sys
import urllib.parse

import requests

logger = logging.getLogger("SFS_CLI says>>>")
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.ERROR)
log_format = logging.Formatter('[%(asctime)s] %(levelname)-8s %(name)-12s %(message)s')
console_handler.setFormatter(log_format)
logger.addHandler(console_handler)

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
url_parsed = urllib.parse.urlsplit(api_url)
url_base = url_parsed.scheme + '://' + url_parsed.netloc

if file_id is not None and http_verb == 'GET':
    try:
        val = int(file_id)
    except ValueError:
        logger.error('The "file_id" field must be a int!')
        exit(1)
    api_response = requests.get(api_url + '/' + file_id)
    file_path = api_response.json()['file']
    file_name = file_path.split('/')[-1]
    print('Downloading file ' + file_name + '...')
    file_url_response = requests.get(url_base + file_path)
    with open(file_name, 'wb') as output_file:
        output_file.write(file_url_response.content)
    print('Download completed.')

elif http_verb == 'GET':
    api_response = requests.get(api_url)
    print('Retrieving files stored on server at ' + url_base + '...')
    files = api_response.json()
    [print(i, file['file'].split('/')[-1]) for i, file in enumerate(files, start=1)]
