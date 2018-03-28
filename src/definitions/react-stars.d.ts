declare module 'react-stars' {
    import * as React from 'react';

    interface Props {
        count: number;
        value: number;
        half: boolean;
    }

    const ReactStars: React.SFC<Props>;
    export = ReactStars;
}