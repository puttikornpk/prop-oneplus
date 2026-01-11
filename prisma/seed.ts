import { PrismaClient, FacilityType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding facilities...')

    const facilities = [
        { name: 'EV Charger', type: FacilityType.FACILITY },
        { name: 'Wi-Fi', type: FacilityType.FACILITY },
        { name: 'ที่จอดรถ', type: FacilityType.FACILITY },
        { name: 'สระว่ายน้ำ', type: FacilityType.FACILITY },
    ]

    const highlights = [
        { name: 'ห้องมุม', type: FacilityType.HIGHLIGHT },
        { name: 'วิวสวย', type: FacilityType.HIGHLIGHT },
        { name: 'ตกแต่งสวย', type: FacilityType.HIGHLIGHT },
        { name: 'พร้อมอยู่', type: FacilityType.HIGHLIGHT },
        { name: 'เลี้ยงสัตว์ได้', type: FacilityType.HIGHLIGHT },
        { name: 'ทิศเหนือ', type: FacilityType.HIGHLIGHT },
        { name: 'ทิศใต้', type: FacilityType.HIGHLIGHT },
        { name: 'ใกล้รถไฟฟ้า', type: FacilityType.HIGHLIGHT },
    ]

    const nearbyPlaces = [
        { name: 'ใกล้ห้าง', type: FacilityType.NEARBY },
        { name: 'ใกล้รถไฟฟ้า', type: FacilityType.NEARBY },
        { name: 'ใกล้สถานศึกษา', type: FacilityType.NEARBY },
        { name: 'ใกล้โรงพยาบาล', type: FacilityType.NEARBY },
        { name: 'ใกล้สนามบิน', type: FacilityType.NEARBY },
    ]

    const allItems = [...facilities, ...highlights, ...nearbyPlaces]

    for (const item of allItems) {
        await prisma.facility.upsert({
            where: {
                name_type: {
                    name: item.name,
                    type: item.type
                }
            },
            update: {},
            create: item,
        })
    }

    console.log('Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
