
from PIL import Image
import imageio
import numpy as np

from skimage import transform, data
outfilename = "preview.gif"  # 转化的GIF图片名称
frames = []
filenames = ["dashboard.png", "login.png", "managebook.png",
             "manageuser.png", "borrowbook.png", "manageborrow.png"]
for image_name in filenames:
    im = imageio.imread(image_name)
    im = transform.resize(im, (im.shape[0]//2, im.shape[1]//2, im.shape[2]))
    print(im.shape)
    frames.append(im)
imageio.mimsave(outfilename, frames, 'GIF', duration=0.3)
