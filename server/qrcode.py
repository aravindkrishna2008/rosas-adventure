import cv2

def scanFromQRCodeFromPath(i):
    qcd = cv2.QRCodeDetector()
    rtvl, info, points =  qcd.detectAndDecode(i)
    return rtvl, info, points

def write(img, points, decoded_info):
    img = cv2.polylines(img, points.astype(int), True, (0, 255, 0), 3)

    for s, p in zip(decoded_info, points):
        img = cv2.putText(img, s, p[0].astype(int),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

    cv2.imwrite('./qrcode_opencv.jpg', img)

rtvl, info, points = scanFromQRCodeFromPath(cv2.imread("./code.png"))
