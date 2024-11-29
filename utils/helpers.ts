
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getComplementaryColor(hex: string): string {
    // 헥사 코드에서 #을 제거하고 6자리 문자열로 변환
    if (hex[0] === '#') {
      hex = hex.slice(1);
    }
  
    // 헥사 코드에서 각 색상 (R, G, B) 값을 추출
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // 각 색상 값의 보색을 계산 (255 - 색상 값)
    const rComplementary = 255 - r;
    const gComplementary = 255 - g;
    const bComplementary = 255 - b;
  
    // 보색 값을 헥사 코드로 변환하여 반환
    const complementHex = `#${toHex(rComplementary)}${toHex(gComplementary)}${toHex(bComplementary)}`;
    return complementHex;
};
  
  // 0~255 범위의 값을 2자리 16진수로 변환하는 헬퍼 함수
export function toHex(value: number): string {
    return value.toString(16).padStart(2, '0');
};

export function addAlphaToHex(hex: string, alpha: number): string {
    if (hex[0] === '#') {
        hex = hex.slice(1);
    };
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return `#${hex}${alphaHex}`;
};

export function numberToDeg(num: number): string {
    return `${num}deg`;
};