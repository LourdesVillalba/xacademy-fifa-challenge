import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import {
    PlayerService,
    UpdatePlayerPayload,
} from '../../services/player/player';

@Component({
    selector: 'app-player-edit',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './player-edit.html',
    styleUrl: './player-edit.css',
})
export class PlayerEditComponent implements OnInit {
    playerId = 0;
    loading = true;
    saving = false;
    errorMessage = '';

    private readonly textValidators = [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(100),
    ];

    private readonly numberValidators = [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(/^\d+$/),
    ];

    form = new FormGroup({
        name: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.pattern(/\S/),
                Validators.maxLength(150),
            ],
        }),

        club: new FormControl('', {
            nonNullable: true,
            validators: this.textValidators,
        }),

        position: new FormControl('', {
            nonNullable: true,
            validators: this.textValidators,
        }),

        nationality: new FormControl('', {
            nonNullable: true,
            validators: this.textValidators,
        }),

        rating: new FormControl(0, {
            nonNullable: true,
            validators: this.numberValidators,
        }),

        speed: new FormControl(0, {
            nonNullable: true,
            validators: this.numberValidators,
        }),

        shooting: new FormControl(0, {
            nonNullable: true,
            validators: this.numberValidators,
        }),

        passing: new FormControl(0, {
            nonNullable: true,
            validators: this.numberValidators,
        }),

        dribbling: new FormControl(0, {
            nonNullable: true,
            validators: this.numberValidators,
        }),

        defending: new FormControl(0, {
            nonNullable: true,
            validators: this.numberValidators,
        }),

        physic: new FormControl(0, {
            nonNullable: true,
            validators: this.numberValidators,
        }),
    });

    constructor(
        private playerService: PlayerService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        if (!Number.isSafeInteger(id) || id <= 0) {
            this.errorMessage = 'ID de jugador inválido.';
            this.loading = false;
            return;
        }

        this.playerId = id;

        this.playerService.getPlayer(id).subscribe({
            next: (player) => {
                this.form.patchValue(player);
                this.loading = false;
            },

            error: (error: HttpErrorResponse) => {
                this.errorMessage =
                    error.status === 404
                        ? 'El jugador no existe.'
                        : 'No se pudieron cargar los datos del jugador.';

                this.loading = false;
            },
        });
    }

    savePlayer(): void {
        if (this.saving) return;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving = true;
        this.errorMessage = '';

        const values = this.form.getRawValue();

        const data: UpdatePlayerPayload = {
            ...values,
            name: values.name.trim(),
            club: values.club.trim(),
            position: values.position.trim(),
            nationality: values.nationality.trim(),
        };

        this.playerService.updatePlayer(this.playerId, data).subscribe({
            next: () => {
                this.saving = false;

                void this.router.navigate([
                    '/players',
                    this.playerId,
                ]);
            },

            error: (error: HttpErrorResponse) => {
                this.saving = false;

                if (error.status === 400) {
                    this.errorMessage =
                        'Los datos ingresados no son válidos.';
                } else if (error.status === 404) {
                    this.errorMessage = 'El jugador no existe.';
                } else {
                    this.errorMessage =
                        'No se pudieron guardar los cambios.';
                }
            },
        });
    }
}
