import {Entity, PrimaryColumn, Column, BaseEntity} from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryColumn()
    id! : number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    email!:string;

    @Column()
    userName!: string;

    @Column({})
    phone!: number;

}
