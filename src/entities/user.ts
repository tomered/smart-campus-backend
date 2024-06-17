import {Entity, PrimaryColumn, Column, BaseEntity, ManyToOne, JoinColumn} from 'typeorm';
import { Role } from './role';

// User table 

@Entity('user')
export class User extends BaseEntity {
    @PrimaryColumn()
    userId! : number;

    @Column({
        generated:'increment',
        type: 'int'
    })
    id!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({
        unique: true
    })
    email!:string;

    @Column({
        unique: true
    })
    userName!: string;

    @Column()
    phone!: number;

    @ManyToOne(() => Role)
    @JoinColumn({name:'roleId'})
    role!:Role

}
