import ky from "ky";

export const weatherApi = ky.create({
  prefix: "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0",
  timeout: 10000,
});

export const hangangApi = ky.create({
  prefix: `http://openapi.seoul.go.kr:8088/${process.env.EXPO_PUBLIC_SEOUL_API_KEY}/json/WPOSInformationTime/1/5`,
  timeout: 10000,
});

export const kakaoApi = ky.create({
  prefix: `https://dapi.kakao.com/v2/local/search/keyword.json`,
  headers: {
    Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}`,
  },
});
