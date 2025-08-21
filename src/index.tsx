import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType, type BlockEditProps } from '@wordpress/blocks';
import metadata from './block.json';
import type { BookingCalendarProps } from './frontend';

registerBlockType<BookingCalendarProps>(metadata.name, {
    edit: EditComponent,
    attributes: {
        commodityId: 'string',
        className: 'string',
        display: 'string',
        id: 'string',
        uuid: 'string',
    },
    category: metadata.category,
    title: metadata.title,
});

function EditComponent(props: BlockEditProps<BookingCalendarProps>) {
    // Example static data for demonstration
    const events = [
        { date: '2025-08-20', event: 'Track Day', time: '10:00', actions: 'Edit/Delete' },
        { date: '2025-08-21', event: 'Driving Experience', time: '14:00', actions: 'Edit/Delete' },
    ];

    return (
        <div {...useBlockProps()}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Event</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Time</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((row, idx) => (
                        <tr key={idx}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.date}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {row.event}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.time}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {row.actions}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
