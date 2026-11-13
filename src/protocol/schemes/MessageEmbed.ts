export type MessageEmbedType = 'Link' | 'Video' | 'Gif' | 'Rich';

export enum MessageEmbedFlag {
    HideContent = 1 << 0,
    Suppressed = 1 << 1,
}

export interface MessageEmbed {
    type: MessageEmbedType;
    root: EmbedComponent[];
    flags: number;
}

export interface SendableEmbed {
    root: EmbedComponent[];
    hideContent?: boolean;
}

export type EmbedTone = 'Accent' | 'Positive' | 'Warning' | 'Danger' | 'Muted';

export interface EmbedContainer {
    type: 'Container';
    style?: 'Filled' | 'Outlined' | 'Plain';
    accent?: EmbedTone | string;
    spoiler?: boolean;
    collapsible?: number;
    children: EmbedComponent[];
}

export interface EmbedColumns {
    type: 'Columns';
    stack?: 'Auto' | 'Never';
    children: EmbedColumn[];
}

export interface EmbedColumn {
    type: 'Column';
    weight?: 1 | 2 | 3 | 'Auto';
    align?: 'Start' | 'Center';
    children: EmbedComponent[];
}

export interface EmbedSeparator {
    type: 'Separator';
}

export interface EmbedText {
    type: 'Text';
    content: string;
    align?: 'Start' | 'Center';
}

export interface EmbedMediaItem {
    url?: string;
    attachmentId?: string;
    width?: number;
    height?: number;
    alt?: string;
    animated?: boolean;
}

export interface EmbedMedia {
    type: 'Media';
    items: EmbedMediaItem[];
    size?: 'Auto' | 'Thumbnail';
    spoiler?: boolean;
}

export interface EmbedPlayer {
    type: 'Player';
    provider: 'YouTube';
    videoId: string;
    start?: number;
}

export interface EmbedButton {
    type: 'Button';
    label: string;
    variant?: 'Filled' | 'Tonal' | 'Outlined' | 'Text';
    tone?: 'Default' | 'Danger';
    icon?: string;
    disabled?: boolean;
    url?: string;
    actionId?: string;
}

export interface EmbedSelectOption {
    label: string;
    value: string;
}

export interface EmbedSelect {
    type: 'Select';
    actionId: string;
    placeholder?: string;
    options: EmbedSelectOption[];
}

export type EmbedComponent =
    | EmbedContainer
    | EmbedColumns
    | EmbedSeparator
    | EmbedText
    | EmbedMedia
    | EmbedPlayer
    | EmbedButton
    | EmbedSelect;
