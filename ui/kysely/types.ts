import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Chat = {
    id: string;
    title: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    userId: string;
    path: string;
    messages: unknown;
    sharePath: string | null;
    summary: string | null;
    attributes: unknown | null;
    isDeleted: Generated<boolean>;
};
export type dim_secondhand_goods_detail = {
    id: Generated<string>;
    item_id: string;
    item_url: string;
    seller_name: string | null;
    seller_id: string | null;
    item_sold: number | null;
    available: boolean;
    interested: number | null;
    post_time: Timestamp;
    updated_time: Timestamp;
    condition: string | null;
    price: string | null;
    price_currency: string | null;
    quantity: number | null;
    location: string | null;
    city: string | null;
    if_free: boolean;
    latitude: number | null;
    longitude: number | null;
    shipping_fee: string | null;
    product_name: string;
    brand: string | null;
    description: string | null;
    main_image: string;
    main_image_oss: string | null;
    image_list: string;
    specification: unknown;
    category: string;
    web_code: string;
    last_update_time: Timestamp;
};
export type GoogleTrend = {
    id: string;
    query: string;
    newsUrl: string;
    newsTitle: string | null;
    newsContent: string | null;
    newsRewrittenTitle: string | null;
    newsSummary: string | null;
    traffic: string;
    attributes: unknown | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type LikeStatus = {
    id: string;
    messageId: string;
    chatId: string;
    userId: string;
    like: number;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type User = {
    id: string;
    name: string | null;
    email: string | null;
    picture: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    attributes: unknown | null;
};
export type DB = {
    Chat: Chat;
    dim_secondhand_goods_detail: dim_secondhand_goods_detail;
    GoogleTrend: GoogleTrend;
    LikeStatus: LikeStatus;
    User: User;
};
